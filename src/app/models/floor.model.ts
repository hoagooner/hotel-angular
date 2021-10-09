export interface Floor {
    floor: string;
    firstRoom: number;
    lastRoom: number;
}

export const floors: Floor[] = [
    {
        floor: "First floor",
        firstRoom: 100,
        lastRoom: 199,
    },
    {
        floor: "Second floor",
        firstRoom: 200,
        lastRoom: 299,
    },
    {
        floor: "Third floor",
        firstRoom: 300,
        lastRoom: 399,
    },
    {
        floor: "Fourth floor",
        firstRoom: 400,
        lastRoom: 499,
    },
    {
        floor: "Fifth floor",
        firstRoom: 500,
        lastRoom: 599,
    },
    {
        floor: "Sixth floor",
        firstRoom: 600,
        lastRoom: 699,
    }
];
