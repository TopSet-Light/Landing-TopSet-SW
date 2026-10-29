/** Share concurrent imports and clear failed requests so the visitor can retry. */
export default function createPageLoader(importPage) {
  let pagePromise;

  return function loadPage() {
    if (!pagePromise) {
      pagePromise = importPage()
        .then((module) => module.default)
        .catch((error) => {
          pagePromise = null;
          throw error;
        });
    }
    return pagePromise;
  };
}
