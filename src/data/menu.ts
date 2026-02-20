export type Category = "All" | "Bengali" | "Indian" | "Chinese" | "Starters" | "Drinks" | "Desserts";

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    isVeg: boolean;
    isBestseller?: boolean;
}

export const menuItems: MenuItem[] = [
    // Bengali
    {
        id: "b1",
        name: "Ilish Bhapa",
        description: "Hilsa fish steamed in mustard sauce, a Bengali classic.",
        price: 450,
        category: "Bengali",
        image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=2074&auto=format&fit=crop",
        isVeg: false,
        isBestseller: true,
    },
    {
        id: "b2",
        name: "Kosha Mangsho",
        description: "Spicy slow-cooked mutton curry.",
        price: 380,
        category: "Bengali",
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=2080&auto=format&fit=crop",
        isVeg: false,
        isBestseller: true,
    },
    {
        id: "b3",
        name: "Shukto",
        description: "Traditional bitter-sweet mixed vegetable stew.",
        price: 180,
        category: "Bengali",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2036&auto=format&fit=crop",
        isVeg: true,
    },

    // Indian
    {
        id: "i1",
        name: "Butter Chicken",
        description: "Tender chicken cooked in rich tomato and butter gravy.",
        price: 320,
        category: "Indian",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop",
        isVeg: false,
        isBestseller: true,
    },
    {
        id: "i2",
        name: "Paneer Lababdar",
        description: "Cottage cheese cubes in a creamy, tangy tomato gravy.",
        price: 280,
        category: "Indian",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1974&auto=format&fit=crop",
        isVeg: true,
    },
    {
        id: "i3",
        name: "Dal Makhani",
        description: "Black lentils cooked overnight with butter and cream.",
        price: 220,
        category: "Indian",
        image: "https://images.unsplash.com/photo-1546833999-b9f58160280b?q=80&w=2072&auto=format&fit=crop",
        isVeg: true,
    },

    // Chinese
    {
        id: "c1",
        name: "Chicken Hakka Noodles",
        description: "Stir-fried noodles with chicken and vegetables.",
        price: 240,
        category: "Chinese",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2080&auto=format&fit=crop",
        isVeg: false,
    },
    {
        id: "c2",
        name: "Chilli Chicken",
        description: "Battered chicken tossed in spicy chilli sauce.",
        price: 260,
        category: "Chinese",
        image: "https://images.unsplash.com/photo-1525755662778-989d966695cc?q=80&w=1974&auto=format&fit=crop",
        isVeg: false,
        isBestseller: true,
    },

    // Starters
    {
        id: "s1",
        name: "Fish Fry",
        description: "Kolkata style breaded fish fillet deep fried.",
        price: 200,
        category: "Starters",
        image: "https://images.unsplash.com/photo-1604135307399-86c6ce0aba8e?q=80&w=1974&auto=format&fit=crop",
        isVeg: false,
    },
    {
        id: "s2",
        name: "Crispy Baby Corn",
        description: "Crunchy baby corn tossed in sweet and spicy sauce.",
        price: 180,
        category: "Starters",
        image: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070&auto=format&fit=crop",
        isVeg: true,
    },

    // Drinks
    {
        id: "d1",
        name: "Blue Lagoon",
        description: "Refreshing blue curacao mocktail.",
        price: 120,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1965&auto=format&fit=crop",
        isVeg: true,
    },
    {
        id: "d2",
        name: "Masala Coke",
        description: "Cola spiced with indian chaat masala.",
        price: 80,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=1974&auto=format&fit=crop",
        isVeg: true,
    },

    // Desserts
    {
        id: "de1",
        name: "Rasgulla",
        description: "Soft cottage cheese balls in sugar syrup.",
        price: 60,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop",
        isVeg: true,
    },
    {
        id: "de2",
        name: "Mishti Doi",
        description: "Fermented sweet yogurt, a Bengali delicacy.",
        price: 80,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
        isVeg: true,
        isBestseller: true,
    },
];
