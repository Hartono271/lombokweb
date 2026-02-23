import { QueryEngine } from '@comunica/query-sparql';
import { Store } from 'n3';
import { RdfXmlParser } from 'rdfxml-streaming-parser';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Global cache untuk RDF store supaya tidak parse ulang setiap request
let cachedStore: Store | null = null;
let lastModified: number | null = null;

async function getRdfStore(): Promise<Store> {
  const rdfFilePath = path.join(process.cwd(), 'public', 'protege-tesis.rdf');
  const stats = fs.statSync(rdfFilePath);
  const currentModified = stats.mtimeMs;

  // Return cached store jika file tidak berubah
  if (cachedStore && lastModified === currentModified) {
    console.log('[OK] Using cached RDF store');
    return cachedStore;
  }

  console.log('[LOAD] Parsing RDF file...');
  const rdfContent = fs.readFileSync(rdfFilePath, 'utf-8');

  // Parse RDF/XML ke N3 Store
  const store = new Store();
  const parser = new RdfXmlParser();
  
  await new Promise<void>((resolve, reject) => {
    const textStream = Readable.from([rdfContent]);
    const quadStream = parser.import(textStream);
    
    quadStream.on('data', (quad) => {
      store.addQuad(quad);
    });
    
    quadStream.on('end', () => {
      resolve();
    });
    
    quadStream.on('error', (error) => {
      reject(error);
    });
  });

  // Cache store dan timestamp
  cachedStore = store;
  lastModified = currentModified;
  console.log('[OK] RDF store cached');

  return store;
}

export async function getDestinations() {
  // Gunakan cached store
  const store = await getRdfStore();
  const myEngine = new QueryEngine();

  // Query untuk mendapatkan data dalam kedua bahasa (EN dan ID)
  const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX to: <http://www.semanticweb.org/harto/ontologies/2025/3/protegetesis#>

    SELECT ?name ?typeURI 
      (SAMPLE(?nameLabelEn) as ?nameEn)
      (SAMPLE(?nameLabelId) as ?nameId)
      (SAMPLE(?typeLabelEn) as ?labelEn) 
      (SAMPLE(?typeLabelId) as ?labelId) 
      (SAMPLE(?desc) as ?description) 
      (SAMPLE(?descEn) as ?descriptionEn) 
      (SAMPLE(?descId) as ?descriptionId) 
      (SAMPLE(?img) as ?image) 
      (SAMPLE(?price) as ?priceVal) 
      (SAMPLE(?priceEn) as ?priceValEn)
      (SAMPLE(?priceId) as ?priceValId)
      (SAMPLE(?rating) as ?ratingVal)
      (SAMPLE(?activity) as ?activityVal)
      (SAMPLE(?activityEn) as ?activityValEn)
      (SAMPLE(?activityId) as ?activityValId)
      (SAMPLE(?facility) as ?facilityVal)
      (SAMPLE(?facilityEn) as ?facilityValEn)
      (SAMPLE(?facilityId) as ?facilityValId)
      (SAMPLE(?openHours) as ?openingHoursVal)
      (SAMPLE(?openHoursEn) as ?openingHoursValEn)
      (SAMPLE(?openHoursId) as ?openingHoursValId)
      (SAMPLE(?video) as ?videoUrl)
      (SAMPLE(?eventTime) as ?timeEventsVal)
      (GROUP_CONCAT(DISTINCT ?locNameEn; separator=", ") as ?locationsEn) 
      (GROUP_CONCAT(DISTINCT ?locNameId; separator=", ") as ?locationsId) 
      (GROUP_CONCAT(DISTINCT ?locTypeURI; separator=", ") as ?locationURIs)
      (GROUP_CONCAT(DISTINCT ?transName; separator=", ") as ?transports)
    WHERE {
      ?s to:TourismName ?name .
      ?s rdf:type ?typeURI .
      FILTER(?typeURI != owl:NamedIndividual)
      
      OPTIONAL { ?s rdfs:label ?nameLabelEn . FILTER(lang(?nameLabelEn) = "en" || lang(?nameLabelEn) = "") }
      OPTIONAL { ?s rdfs:label ?nameLabelId . FILTER(lang(?nameLabelId) = "id") }
      
      OPTIONAL { ?typeURI rdfs:label ?typeLabelEn . FILTER(lang(?typeLabelEn) = "en" || lang(?typeLabelEn) = "") }
      OPTIONAL { ?typeURI rdfs:label ?typeLabelId . FILTER(lang(?typeLabelId) = "id") }
      
      OPTIONAL { ?s to:Description ?desc . }
      OPTIONAL { ?s to:meaningdescription ?descEn . FILTER(lang(?descEn) = "en") }
      OPTIONAL { ?s to:meaningdescription ?descId . FILTER(lang(?descId) = "id") }
      
      OPTIONAL { ?s to:Images ?img . }
      OPTIONAL { ?s to:Price ?price . }
      OPTIONAL { ?s to:pricedescription ?priceEn . FILTER(lang(?priceEn) = "en") }
      OPTIONAL { ?s to:pricedescription ?priceId . FILTER(lang(?priceId) = "id") }
      OPTIONAL { ?s to:Ratings ?rating . }
      
      OPTIONAL { ?s to:Activity ?activity . }
      OPTIONAL { ?s to:activitydescprition ?activityEn . FILTER(lang(?activityEn) = "en") }
      OPTIONAL { ?s to:activitydescprition ?activityId . FILTER(lang(?activityId) = "id") }
      
      OPTIONAL { ?s to:Facility ?facility . }
      OPTIONAL { ?s to:facilitydescription ?facilityEn . FILTER(lang(?facilityEn) = "en") }
      OPTIONAL { ?s to:facilitydescription ?facilityId . FILTER(lang(?facilityId) = "id") }
      
      OPTIONAL { ?s to:OpeningHours ?openHours . }
      OPTIONAL { ?s to:openinghoursdescription ?openHoursEn . FILTER(lang(?openHoursEn) = "en") }
      OPTIONAL { ?s to:openinghoursdescription ?openHoursId . FILTER(lang(?openHoursId) = "id") }

      OPTIONAL {
        ?s to:Locatedin ?loc .
        ?loc rdf:type ?locType .
        FILTER(?locType != owl:NamedIndividual)
        OPTIONAL { ?locType rdfs:label ?locLabelEn . FILTER(lang(?locLabelEn) = "en" || lang(?locLabelEn) = "") }
        OPTIONAL { ?locType rdfs:label ?locLabelId . FILTER(lang(?locLabelId) = "id") }
        BIND(COALESCE(?locLabelEn, STRAFTER(STR(?locType), "#")) as ?locNameEn)
        BIND(COALESCE(?locLabelId, STRAFTER(STR(?locType), "#")) as ?locNameId)
        BIND(STRAFTER(STR(?locType), "#") as ?locTypeURI)
      }

      OPTIONAL {
        ?trans to:used_to_reach ?s .
        BIND(STRAFTER(STR(?trans), "#") as ?transName)
      }

      OPTIONAL { ?s to:Video ?video . }
      OPTIONAL { ?s to:TimeEvents ?eventTime . }
    }
    GROUP BY ?name ?typeURI
    LIMIT 300
  `;

  try {
    const bindingsStream = await myEngine.queryBindings(query, {
      sources: [store],
    });

    const bindings = await bindingsStream.toArray();

    const mainData = bindings.map((b: any) => ({
      name: b.get('name')?.value || '',
      nameEn: b.get('nameEn')?.value || b.get('name')?.value || '',
      nameId: b.get('nameId')?.value || b.get('nameEn')?.value || b.get('name')?.value || '',
      typeURI: b.get('typeURI')?.value || '',
      // Data dalam bahasa Inggris
      typeLabelEn: b.get('labelEn')?.value || extractTypeName(b.get('typeURI')?.value || ''),
      descEn: b.get('descriptionEn')?.value || b.get('description')?.value || '',
      activityEn: b.get('activityValEn')?.value || b.get('activityVal')?.value || '',
      facilityEn: b.get('facilityValEn')?.value || b.get('facilityVal')?.value || '',
      priceEn: b.get('priceValEn')?.value || b.get('priceVal')?.value || '',
      openingHoursEn: b.get('openingHoursValEn')?.value || b.get('openingHoursVal')?.value || '',
      locationEn: b.get('locationsEn')?.value || 'Lombok',
      // Data dalam bahasa Indonesia
      typeLabelId: b.get('labelId')?.value || b.get('labelEn')?.value || extractTypeName(b.get('typeURI')?.value || ''),
      descId: b.get('descriptionId')?.value || b.get('descriptionEn')?.value || b.get('description')?.value || '',
      activityId: b.get('activityValId')?.value || b.get('activityValEn')?.value || b.get('activityVal')?.value || '',
      facilityId: b.get('facilityValId')?.value || b.get('facilityValEn')?.value || b.get('facilityVal')?.value || '',
      priceId: b.get('priceValId')?.value || b.get('priceValEn')?.value || b.get('priceVal')?.value || '',
      openingHoursId: b.get('openingHoursValId')?.value || b.get('openingHoursValEn')?.value || b.get('openingHoursVal')?.value || '',
      locationId: b.get('locationsId')?.value || 'Lombok',
      // Data umum
      img: b.get('image')?.value || '',
      rating: b.get('ratingVal')?.value || '',
      transport: b.get('transports')?.value || '',
      video: b.get('videoUrl')?.value || '',
      timeEvents: b.get('timeEventsVal')?.value || '',
      locationURI: b.get('locationURIs')?.value || ''
    }));

    // Fetch Events data separately (they use rdfs:label instead of TourismName)
    const eventsData = await fetchEventsData(store, myEngine);
    
    return [...mainData, ...eventsData];

  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function extractTypeName(uri: string) {
  const match = uri.match(/#([^#]+)$/);
  return match ? match[1].replace(/([A-Z])/g, ' $1').trim() : "Destination";
}

async function fetchEventsData(store: Store, engine: QueryEngine) {
  const eventsQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX to: <http://www.semanticweb.org/harto/ontologies/2025/3/protegetesis#>

    SELECT ?eventNameEn ?eventNameId ?desc ?descEn ?descId ?img ?time ?video
    WHERE {
      ?s rdf:type to:Events .
      OPTIONAL { ?s rdfs:label ?eventNameEn . FILTER(lang(?eventNameEn) = "en" || lang(?eventNameEn) = "") }
      OPTIONAL { ?s rdfs:label ?eventNameId . FILTER(lang(?eventNameId) = "id") }
      OPTIONAL { ?s to:Description ?desc }
      OPTIONAL { ?s to:meaningdescription ?descEn . FILTER(lang(?descEn) = "en") }
      OPTIONAL { ?s to:meaningdescription ?descId . FILTER(lang(?descId) = "id") }
      OPTIONAL { ?s to:Images ?img }
      OPTIONAL { ?s to:TimeEvents ?time }
      OPTIONAL { ?s to:Video ?video }
    }
  `;

  try {
    const bindingsStream = await engine.queryBindings(eventsQuery, {
      sources: [store],
    });

    const bindings = await bindingsStream.toArray();

    return bindings.map((b: any) => ({
      name: b.get('eventNameEn')?.value || b.get('eventNameId')?.value || 'Event',
      nameEn: b.get('eventNameEn')?.value || b.get('eventNameId')?.value || 'Event',
      nameId: b.get('eventNameId')?.value || b.get('eventNameEn')?.value || 'Acara',
      typeURI: "http://www.semanticweb.org/harto/ontologies/2025/3/protegetesis#Events",
      typeLabelEn: "Events",
      typeLabelId: "Acara",
      descEn: b.get('descEn')?.value || b.get('desc')?.value || '',
      descId: b.get('descId')?.value || b.get('descEn')?.value || b.get('desc')?.value || '',
      activityEn: "", activityId: "",
      facilityEn: "", facilityId: "",
      priceEn: "", priceId: "",
      openingHoursEn: "", openingHoursId: "",
      locationEn: "Lombok", locationId: "Lombok",
      locationURI: "",
      img: b.get('img')?.value || '',
      rating: "",
      transport: "",
      video: b.get('video')?.value || '',
      timeEvents: b.get('time')?.value || ''
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}