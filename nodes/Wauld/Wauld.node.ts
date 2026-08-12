import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { credentialDescription } from './resources/credential';

export class Wauld implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wauld',
		name: 'wauld',
		icon: {
			light: 'file:wauld.svg',
			dark: 'file:wauld.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Issue and manage digital credentials with Wauld',
		defaults: {
			name: 'Wauld',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'wauldApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://wauld.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Credential',
						value: 'credential',
					},
				],
				default: 'credential',
			},
			...credentialDescription,
		],
	};
}