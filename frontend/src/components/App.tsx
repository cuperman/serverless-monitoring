import React from 'react';

import ItemTable from './ItemTable';
import NewItemModal from './NewItemModal';
import ShowItemModal from './ShowItemModal';

import {
    Item,
    ItemAttributes,
    createItem,
    listItems,
    getItem,
    deleteItem
} from '../models/inventory';

interface AppProps {}

interface AppState {
    items: Item[];
    newItem: boolean;
    showItem: Item | null;
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(app: AppProps) {
        super(app);

        this.state = {
            items: [],
            newItem: false,
            showItem: null
        };

        this.refreshItems = this.refreshItems.bind(this);
        this.newItem = this.newItem.bind(this);
        this.closeNewItem = this.closeNewItem.bind(this);
        this.submitItem = this.submitItem.bind(this);
        this.showItem = this.showItem.bind(this);
        this.closeItem = this.closeItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    refreshItems() {
        listItems().then(items => {
            this.setState({
                items
            });
        });
    }

    newItem() {
        this.setState({
            newItem: true
        });
    }

    closeNewItem() {
        this.setState({
            newItem: false
        });
    }

    submitItem(attributes: ItemAttributes) {
        createItem(attributes).then(() => this.refreshItems());
    }

    showItem(id: string) {
        getItem(id).then(item => {
            this.setState({
                showItem: item
            });
        });
    }

    closeItem() {
        this.setState({
            showItem: null
        });
    }

    deleteItem(id: string) {
        deleteItem(id).then(() => this.refreshItems());
    }

    componentDidMount() {
        this.refreshItems();
    }

    render() {
        const { items, newItem, showItem } = this.state;

        return (
            <div className="container">
                <div className="pb-2 mt-4 mb-2">
                    <h1>
                        Inventory
                        <div className="float-right">
                            <button
                                className="btn btn-success"
                                onClick={() => this.newItem()}
                            >
                                New
                            </button>
                        </div>
                    </h1>
                </div>
                <div>
                    <ItemTable
                        items={items}
                        showItem={this.showItem}
                        deleteItem={this.deleteItem}
                    />
                </div>
                {newItem && (
                    <NewItemModal
                        cancelNewItem={this.closeNewItem}
                        createItem={this.submitItem}
                    />
                )}
                {showItem && (
                    <ShowItemModal
                        item={showItem}
                        closeModal={this.closeItem}
                    />
                )}
            </div>
        );
    }
}
