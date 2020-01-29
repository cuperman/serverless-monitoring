import fetch from 'node-fetch';

import { API_BASE_URL } from '../config';

function requestHeaders(headers = {}) {
    const defaultHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return Object.assign({}, defaultHeaders, headers);
}

export interface ItemAttributes {
    name: string;
    description: string;
    color: string;
    quantity: number;
}

export interface Item extends ItemAttributes {
    id: string;
}

export async function createItem(attributes: ItemAttributes): Promise<void> {
    await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: requestHeaders(),
        body: JSON.stringify(attributes)
    });
}

export async function listItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'GET',
        headers: requestHeaders()
    });
    return response.json();
}

export async function getItem(id: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'GET',
        headers: requestHeaders()
    });
    return response.json();
}

export async function deleteItem(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE',
        headers: requestHeaders()
    });
    return;
}
