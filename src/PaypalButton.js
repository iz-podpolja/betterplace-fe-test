import React from "react";
import ReactDOM from "react-dom";
import { connect } from "formik";

const buttonStyle = {
  color: "gold",
  fundingicons: false,
  label: "checkout",
  shape: "rect",
  size: "responsive",
  tagline: false,
};

class PaypalButton extends React.Component {
  createOrderOrBillingAgreement = async () => {
    this.props.formik.submitForm(); // submit will call api with form values and inject _paypal_token into the form values
    await this.sleepUntilSubmitted();
    if (this.props.formik.isValid) this.props.formik.setSubmitting(true);
    return this.props.formik.values._paypal_token;
  };

  sleepUntilSubmitted = async () => {
    const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));
    while (this.props.formik.isSubmitting) {
      await sleep(100);
    }
  };

  onApprove = () => {
    // do something on success
  };

  render = () => {
    const paypal = window["paypal"];
    if (!paypal) return null;

    const Button = paypal.Buttons.driver("react", { React, ReactDOM });
    const { isSubmitting } = this.props.formik;

    return (
      <div>
        <div style={(isSubmitting && { display: "none" }) || {}}>
          <Button
            commit
            env="sandbox"
            createBillingAgreement={this.createOrderOrBillingAgreement}
            onApprove={this.onApprove}
            onCancel={() => this.props.formik.setSubmitting(false)}
            onError={() => this.props.formik.setSubmitting(false)}
            style={buttonStyle}
          />
        </div>
      </div>
    );
  };
}

export default connect(PaypalButton);
