/**
 * Copyright (c) 2023 frostime. All rights reserved.
 */

import { fetchSyncPost, IWebSocketData } from "siyuan";


async function request(url: string, data: any) {
    let response: IWebSocketData = await fetchSyncPost(url, data);
    let res = response.code === 0 ? response.data : null;
    return res;
}

export async function lsNotebooks() {
    let url = '/api/notebook/lsNotebooks';
    return request(url, '');
}

// **************************************** Block ****************************************
export type ChildBlock = {
    id: BlockId;
    type: BlockType;
    subtype?: BlockSubType;
}
export async function getChildBlocks(id: BlockId): Promise<ChildBlock[]> {
    let data = {
        id: id
    }
    let url = '/api/block/getChildBlocks';
    return request(url, data);
}


export async function transferBlockRef(fromID: BlockId, toID: BlockId, refIDs: BlockId[]) {
    let data = {
        fromID: fromID,
        toID: toID,
        refIDs: refIDs
    }
    let url = '/api/block/transferBlockRef';
    return request(url, data);
}

// **************************************** SQL ****************************************

export async function sql(sql: string): Promise<any[]> {
    let sqldata = {
        stmt: sql,
    };
    let url = '/api/query/sql';
    return request(url, sqldata);
}

export async function getBlockByID(blockId: string): Promise<Block> {
    let sqlScript = `select * from blocks where id ='${blockId}'`;
    let data = await sql(sqlScript);
    return data[0];
}
