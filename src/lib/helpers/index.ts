export function coalesce(a: number | undefined | null, b: number | null) {
    return a == null ? Number(b) : a;
}
