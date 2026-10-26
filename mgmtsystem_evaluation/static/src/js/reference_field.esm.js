/* Copyright 2026 NuoBiT Solutions SL - Eric Antones <eantones@nuobit.com>
   License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl). */

import {
    ReferenceField,
    referenceField,
} from "@web/views/fields/reference/reference_field";
import {patch} from "@web/core/utils/patch";

// The model_field option reads the ir.model record of its many2one, which most
// users cannot read; model_field_char takes the technical name of the model
// from a char field instead.
ReferenceField.props = {
    ...ReferenceField.props,
    modelFieldChar: {type: String, optional: true},
};

const referenceFieldExtractProps = referenceField.extractProps;
referenceField.extractProps = (fieldInfo, dynamicInfo) => ({
    ...referenceFieldExtractProps(fieldInfo, dynamicInfo),
    modelFieldChar: fieldInfo.options.model_field_char,
});

patch(ReferenceField.prototype, {
    get hideModelSelector() {
        return super.hideModelSelector || Boolean(this.props.modelFieldChar);
    },

    get m2oProps() {
        const props = super.m2oProps;
        delete props.modelFieldChar;
        return props;
    },

    getModelName() {
        return this.props.modelFieldChar
            ? this.props.record.data[this.props.modelFieldChar]
            : super.getModelName();
    },
});
