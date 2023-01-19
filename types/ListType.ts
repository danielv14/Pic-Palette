const types = ["type", "query"] as const;

export type ListType = typeof types[number];
