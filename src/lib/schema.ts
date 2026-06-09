export type JsonLdNode = Record<string, unknown>;

export function createJsonLdGraph(nodes: JsonLdNode[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function createBreadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
