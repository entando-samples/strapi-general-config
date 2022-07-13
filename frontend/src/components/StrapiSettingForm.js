import { Col, FieldLevelHelp, Grid, Row } from 'patternfly-react';
import { Button } from 'patternfly-react/dist/js/components/Button';
import React, { Component } from 'react';
import { getStrapiConfiguration, saveStrapiConfiguration } from '../api/api';

export default class StrapiSettingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'formValidation',
            fields: {
                baseUrl: ""
            },
            errors: {
                baseUrl: ''
            }
        };
    }

    validate = (name, value) => {
        switch (name) {
            case "baseUrl":
                if (!value) {
                    return "Application URL is Required";
                } else if (
                    !value.match(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/)
                ) {
                    return "Enter a valid application URL";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    }

    handleUserInput = e => {
        this.setState({
            errors: {
                ...this.state.errors,
                [e.target.name]: this.validate(e.target.name, e.target.value)
            },
            fields: {
                ...this.state.fields,
                [e.target.name]: e.target.value
            }
        });
    };

    handleSubmit = e => {
        const { fields, error } = this.state;
        e.preventDefault();
        let validationErrors = {};
        Object.keys(fields).forEach(name => {
            const error = this.validate(name, fields[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            this.setState({ errors: validationErrors });
            return;
        }
        if (fields.baseUrl) {
            const data = {
                baseUrl: fields.baseUrl
            };
            this.callSaveStrapiConfiguration(data);
        }
    };

    componentDidMount = async () => {
        this.callGetStrapiConfiguration();
    }

    async callSaveStrapiConfiguration(payload) {
        const { data, isError } = await saveStrapiConfiguration(payload);
        if (data && !isError) {
            this.setState({
                fields: { baseUrl: data.data.baseUrl }
            });
        } else if(data && isError) {
            console.error(data);
        }
    }

    async callGetStrapiConfiguration() {
        const { data, isError } = await getStrapiConfiguration();
        if (data && data.data && !isError) {
            this.setState({
                fields: { baseUrl: data.data.baseUrl }
            });
        }
    }

    render() {
        const { fields, errors } = this.state;
        return (
            <div>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
                <Grid>
                    <Row className="mt-2">
                        <Col lg={12}>
                            <h1><b>Strapi config setting</b></h1>
                        </Col>
                    </Row>
                    <Row className="mt-2"></Row>
                    <Row className="mt-2">
                        <Col lg={3}>
                            <label htmlFor="type" className="control-label">
                                <span className="FormLabel">
                                    <span>Application URL</span>
                                    <sup>
                                        <i className="fa fa-asterisk required-icon FormLabel__required-icon"></i>
                                    </sup>
                                </span>
                            </label>
                            <FieldLevelHelp buttonClass="" close={undefined} content="URL of the application, Example - http://142.32.54.82:1337." inline placement="right" rootClose />
                        </Col>
                        <Col lg={5}>
                            <input
                                name="baseUrl"
                                type="text"
                                id="id"
                                value={this.state.fields.baseUrl}
                                placeholder=""
                                className="form-control RenderTextInput"
                                onChange={event => this.handleUserInput(event)}
                            />
                            <span className="text-danger">{errors.baseUrl}</span>
                        </Col>
                        <Col lg={4}></Col>
                    </Row>
                    <Row>
                        <Col lg={8}></Col>
                        <Col lg={4}>
                            <Button className="btn-primary btn" type="submit">Save</Button>
                        </Col>
                    </Row>
                </Grid>
            </form>
        </div>
        )
    }
}
