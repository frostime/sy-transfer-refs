export let notebookName: Map<string, string> = new Map();

export const setNotebookName = (map: Map<string, string>) => {
    // replace the old map
    notebookName = map;
}
