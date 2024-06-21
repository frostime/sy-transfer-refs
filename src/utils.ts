/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-04-18 18:51:05
 * @FilePath     : /src/utils.ts
 * @LastEditTime : 2024-06-21 17:19:57
 * @Description  : 
 */
import * as api from "./api";
import zh_CN from "./i18n/zh_CN.json";

export const fb2p = async (inputs: BlockId[]): Promise<{ [key: BlockId]: BlockId}> => {

    let data: { [key: string]: any } = await api.request('/api/block/getBlockTreeInfos', {
        ids: inputs
    });

    let results = {};
    for (let id of inputs) {
        results[id] = id;
        let info = data[id];
        if (info.type !== 'NodeParagraph') continue;
        if (info.previousID !== '') continue;
        if (!['NodeBlockquote', 'NodeListItem'].includes(info.parentType)) continue;

        results[id] = info.parentID;
    }
    return results;
};

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
