import React, { ChangeEvent } from 'react';

interface FormInputProps {
    type: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default class FormInput extends React.Component<FormInputProps> {
    capitalize(word: string) {
        return [word.charAt(0).toUpperCase(), word.slice(1)].join('');
    }

    render() {
        return (
            <div className="form-group">
                <label>{this.capitalize(this.props.name)}</label>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    className="form-control"
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}
