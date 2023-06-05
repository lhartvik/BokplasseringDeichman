export const sok = async (recordId) => {
  const url =
    'https://deichman.no/api/search?query=' +
    encodeURI(`recordId:${recordId}`) +
    '&filter=branch_bjor';

  const response = await fetch(url).then(response => response.json());

  const books = response.hits.map(hit => ({
    recordId: hit.recordId,
    fullTitle: hit.fullTitle,
    ids: hit.ids[0],
    shelfMark: hit.shelfMark,
  }));

  const plasseringUrl =
    'https://deichman.no/api/cicero/open/copies?id=' + recordId;

  const plassering = await fetch(plasseringUrl).then(response =>
    response.json(),
  );

  const plasseringer = Object.values(plassering)
    .flatMap(x => x.items)
    .filter(it => it.branchcode === 'bjor')
    .map(book => ({
      key: books[0].recordId,
      tittel: books[0].fullTitle,
      locLabel: book.locLabel,
      shelfmark: book.shelfmark,
      status: book.status,
      available: book.available,
      notforloan: book.notforloan,
      signature: book.signature,
    }));

  return plasseringer[0];
};
