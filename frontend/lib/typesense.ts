import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey:    process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY!,
    nodes: [{
      host:     process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port:     Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT!),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!,
    }],
  },
  additionalSearchParameters: {
    query_by: 'title,tags',
  },
});

export const searchClient = typesenseAdapter.searchClient;