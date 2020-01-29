import React from 'react';

import { Item } from '../models/inventory';

interface ShowItemModalProps {
    closeModal: () => void;
    item: Item;
}

export default class ShowItemModal extends React.Component<ShowItemModalProps> {
    render() {
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
                                <h5 className="modal-title">Show Item</h5>
                                <button
                                    className="close"
                                    onClick={this.props.closeModal}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <pre>
                                    <code>
                                        {JSON.stringify(
                                            this.props.item,
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </div>
        );
    }
}
