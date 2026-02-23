import { dictionary } from '../dictionary';

export function getCategories(lang: 'id' | 'en') {
  const t = dictionary[lang];
  return [
    { key: 'all', icon: 'fas fa-globe', label: t.catAll },
    { key: 'MarineTourism', icon: 'fas fa-umbrella-beach', label: t.catBeach },
    { key: 'MountainTourism', icon: 'fas fa-mountain', label: t.catMountain },
    { key: 'CulturalandReligiousTourism', icon: 'fas fa-landmark', label: t.catCulture },
    { key: 'WaterfallTourism', icon: 'fas fa-water', label: t.catWaterfall },
    { key: 'IslandTourism', icon: 'fas fa-tree', label: t.catIsland },
    { key: 'CaveTourism', icon: 'fas fa-dungeon', label: t.catCave },
    { key: 'Agrotourism', icon: 'fas fa-seedling', label: t.catAgro },
    { key: 'CulinaryTourism', icon: 'fas fa-utensils', label: t.catCulinary },
    { key: 'BathingTourism', icon: 'fas fa-swimming-pool', label: t.catBathing },
    { key: 'ShoppingTour', icon: 'fas fa-shopping-bag', label: t.catShopping },
    { key: 'TouristPark', icon: 'fas fa-tree', label: t.catPark },
    { key: 'Events', icon: 'fas fa-calendar-alt', label: t.catEvents },
  ];
}
