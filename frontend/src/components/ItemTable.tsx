import React from 'react';

import { Item } from '../models/inventory';

interface ItemTableProps {
    items: Item[];
    showItem: (id: string) => void;
    deleteItem: (id: string) => void;
}

export default class ItemTable extends React.Component<ItemTableProps> {
    render() {
        const { items, showItem, deleteItem } = this.props;

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-info"
                                        onClick={() => showItem(item.id)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
