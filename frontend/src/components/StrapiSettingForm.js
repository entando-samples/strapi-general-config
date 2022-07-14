import { Col, FieldLevelHelp, Grid, Row } from 'patternfly-react';
import { Button } from 'patternfly-react/dist/js/components/Button';
import React, { Component } from 'react';
import { getStrapiConfiguration, saveStrapiConfiguration } from '../api/api';
import { BUTTON_SAVE, LABEL_APPLICATION_URL, LABEL_STRAPI_CONFIG_SETTINGS, MSG_REQ_APPLICATION_URL, MSG_VALID_APPLICATION_URL, TOOLTIP_URL } from '../helpers/constants';

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
                    return MSG_REQ_APPLICATION_URL;
                } else if (
                    !value.match(/(?:https?):\/\/(localhost|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(:([0-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-9][0-9]{3}|[1-5][0-9]{4}|6([0-4][0-9]{3}|5([0-4][0-9]{2}|5([0-2][0-9]|3[0-5])))))?$/)
                ) {
                    return MSG_VALID_APPLICATION_URL;
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
        const { fields } = this.state;
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
        } else if (data && isError) {
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
        const { errors } = this.state;
        return (
            <div>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
                <Grid>
                    <Row className="mt-2">
                        <Col lg={12}>
                            <h1><b>{LABEL_STRAPI_CONFIG_SETTINGS}</b></h1>
                        </Col>
                    </Row>
                    <Row className="mt-2"></Row>
                    <Row className="mt-2">
                        <Col lg={3}>
                            <label htmlFor="type" className="control-label">
                                <span className="FormLabel">
                                    <span>{LABEL_APPLICATION_URL}</span>
                                    <sup>
                                        <i className="fa fa-asterisk required-icon FormLabel__required-icon"></i>
                                    </sup>
                                </span>
                            </label>
                            <FieldLevelHelp buttonClass="" close={undefined} content={TOOLTIP_URL} inline placement="right" rootClose />
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
                            <Button className="btn-primary btn" type="submit">{BUTTON_SAVE}</Button>
                        </Col>
                    </Row>
                </Grid>
            </form>
        </div>
        )
    }
}
