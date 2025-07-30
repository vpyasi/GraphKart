const imageModules = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true });

const imageMap: Record<string, string> = {};
for (const path in imageModules) {
    const filename = path.split('/').pop()!;
    imageMap[filename] = (imageModules[path] as any).default;
}
export default imageMap;
