// frontend/shims/expo-constants.js

import { requireOptionalNativeModule } from 'expo-modules-core';

const ExponentConstants = requireOptionalNativeModule('ExponentConstants');

export default ExponentConstants || {};
