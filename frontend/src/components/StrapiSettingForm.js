import { Col, FieldLevelHelp, Grid, Row } from 'patternfly-react';
import { Spinner } from 'patternfly-react/dist/js/components/Spinner';
import React, { Component } from 'react';
import { getStrapiConfiguration, saveStrapiConfiguration } from '../api/api';
import { BUTTON_SAVE, LABEL_APPLICATION_URL, LABEL_STRAPI_CONFIG_SETTINGS, MSG_REQ_APPLICATION_URL, MSG_VALID_APPLICATION_URL, TOOLTIP_URL } from '../helpers/constants';

export default class StrapiSettingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                baseUrl: ""
            },
            errors: {
                baseUrl: ''
            },
            loadingData: false
        };
    }

    validate = (value) => {
        if (!value) {
            return MSG_REQ_APPLICATION_URL;
        } else if (
            !value.match(/(((http)|(https))?:\/\/(www)\.(\w+)\.((\w{3})|(\w{2}))$)|^((https?:\/\/))(?:([a-zA-Z]+)|(\d+\.\d+.\d+.\d+)):\d{4}$/)
        ) {
            return MSG_VALID_APPLICATION_URL;
        } else {
            return "";
        }
    }

    handleUserInput = e => {
        this.setState({
            errors: {
                ...this.state.errors,
                [e.target.name]: this.validate(e.target.value)
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
        const error = this.validate(fields.baseUrl);
        if (error) {
            this.setState({ errors: error });
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
        this.setState({ loadingData: true });
        const { data, isError } = await saveStrapiConfiguration(payload);
        if (data && !isError) {
            this.setState({
                fields: { baseUrl: data.data.baseUrl }
            });
        } else if (data && isError) {
            console.error(data);
        }
        this.setState({ loadingData: false });
    }

    async callGetStrapiConfiguration() {
        this.setState({ loadingData: true });
        const { data, isError } = await getStrapiConfiguration();
        if (data && data.data && !isError) {
            this.setState({
                fields: { baseUrl: data.data.baseUrl }
            });
        }
        this.setState({ loadingData: false });
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
                            {this.state.loadingData &&
                                <Spinner
                                loading={this.state.loadingData}
                                className=""
                                size="md"
                                ></Spinner>}
                        </Col>
                        <Col lg={4}></Col>
                    </Row>
                    <Row>
                        <Col lg={8}></Col>
                        <Col lg={4}>
                            <button className="btn-primary btn"
                                disabled={this.state.errors.baseUrl.length}>{BUTTON_SAVE}
                            </button>
                        </Col>
                    </Row>
                </Grid>
            </form>
        </div>
        )
    }
}
