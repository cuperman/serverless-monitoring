import React from 'react';
import FormInput from './FormInput';
import { ItemAttributes } from '../models/inventory';

interface NewItemModalProps {
    cancelNewItem: () => void;
    createItem: (attributes: ItemAttributes) => void;
}

type NewItemModalState = { [name: string]: string | number };

export default class NewItemModal extends React.Component<
    NewItemModalProps,
    NewItemModalState
> {
    constructor(props: NewItemModalProps) {
        super(props);

        this.state = {
            name: '',
            description: '',
            color: '',
            quantity: 0
        };

        this.updateAttribute = this.updateAttribute.bind(this);
        this.callCreateItem = this.callCreateItem.bind(this);
    }

    updateAttribute(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target.getAttribute('name') || '';
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    callCreateItem() {
        const { name, description, color, quantity } = this.state;
        this.props.createItem({
            name: name.toString(),
            description: description.toString(),
            color: color.toString(),
            quantity: parseInt(quantity.toString(), 10)
        });
        this.props.cancelNewItem();
    }

    render() {
        const { cancelNewItem } = this.props;

        return (
            <div>
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    style={{ display: 'block' }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Item</h5>
                                <button
                                    className="close"
                                    onClick={cancelNewItem}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <FormInput
                                        name="name"
                                        type="string"
                                        onChange={this.updateAttribute}
                                    />
                                    <FormInput
                                        name="description"
                                        type="string"
                                        onChange={this.updateAttribute}
                                    />
                                    <FormInput
                                        name="color"
                                        type="string"
                                        onChange={this.updateAttribute}
                                    />
                                    <FormInput
                                        name="quantity"
                                        type="number"
                                        onChange={this.updateAttribute}
                                    />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={cancelNewItem}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.callCreateItem}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </div>
        );
    }
}
