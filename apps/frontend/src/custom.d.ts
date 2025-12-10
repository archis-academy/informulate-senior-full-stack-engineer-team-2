declare module '*.module.scss' {
	// simple CSS Modules typing
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.scss' {
	// for plain scss imports (if any)
	const content: { [key: string]: string } | string;
	export default content;
}

declare module '@src/*' {
	// alias used in imports like "@src/main.scss" or "@src/..."
	const value: any;
	export default value;
}
