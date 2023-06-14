import * as api from "./api";
import zh_CN from "./i18n/zh_CN.json";

export let notebookName: Map<string, string> = new Map();

export const setNotebookName = (map: Map<string, string>) => {
    // replace the old map
    notebookName = map;
}

export let i18n: typeof zh_CN;

export let setI18n = (i18nObj: any) => {
    i18n = i18nObj;
}

export async function getChildDocs(block: BlockId) {
    let sqlCode = `select * from blocks where path regexp '.*/${block}/[0-9a-z\-]+\.sy' and type='d'
    order by hpath desc;`;
    let childDocs = await api.sql(sqlCode);
    return childDocs;
}

export function isnot(value: any) {
    if (value === undefined || value === null) {
        return true;
    } else if (value === false) {
        return true;
    } else if (typeof value === 'string' && value.trim() === '') {
        return true;
    } else if (value?.length === 0) {
        return true;
    }
    return false;
}
/**
 * 获取文档相关信息：父文档、同级文档、子文档
 */
// async function getDocumentRelations(docId: DocumentId, sqlResult) {
//     // let sqlResult = await sqlAPI(`SELECT * FROM blocks WHERE id = "${docId}"`);
//     // 获取父文档
//     let parentDoc = await getParentDocument(docId, sqlResult);

//     // 获取子文档
//     let childDocs = await getChildDocuments(docId, sqlResult);

//     let noParentFlag = false;
//     if (parentDoc.length == 0) {
//         noParentFlag = true;
//     }
//     // 返回结果
//     return [parentDoc, childDocs];
// }

// async function getParentDocument(docId: DocumentId, sqlResult) {
//     let splitText = sqlResult[0].path.split("/");
//     if (splitText.length <= 2) return [];
//     let parentSqlResult = await api.sql(`SELECT * FROM blocks WHERE id = "${splitText[splitText.length - 2]}"`);
//     return parentSqlResult;
// }

// async function getChildDocuments(docId: DocumentId, sqlResult) {
//     let childDocs = await listDocsByPath({ path: sqlResult[0].path, notebook: sqlResult[0].box });
//     if (childDocs.files.length > g_setting.docMaxNum && g_setting.docMaxNum != 0) {
//         childDocs.files = childDocs.files.slice(0, g_setting.docMaxNum);
//     }
//     return childDocs.files;
// }


