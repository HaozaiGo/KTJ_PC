/*
 * @Author: xiaoHao
 */
/*
 * @Author: xiaoHao
 */
import { defineAsyncComponent } from "vue";
import type { RouteRecordRaw } from "vue-router";

function getModules() {
	const components = import.meta.glob('/src/views/**/*.vue');
	return components
}

function getComponents() {
	const components = import.meta.glob('/src/views/**/*.vue', { eager: true });
	return components
}
// 注册路由
export const vueRouter = function (): Array<RouteRecordRaw> {
	let routerList: Array<RouteRecordRaw> = [];
	const modules = getModules();
	const components = getComponents();
	// console.log(modules);
	// console.log(components);
	Object.keys(modules).forEach(key => {
		const viewSrc = components[key];
		// console.log(viewSrc);
		const file = viewSrc.default;
		// 处理path路径
		let pathSp = key.split('views/');
		const pathRes = pathSp[1].replace('/index.vue', '');
		// console.log(modules[key]);

		if (!file.isRouter) return
		routerList.push({
			path: pathRes,
			name: `${file.name}`,
			component: modules[key]
		})
	})
	console.log(routerList);
	return routerList
}
// 注册组件
export const asyncComponent = function (app: App<Element>): void {
	const modules = getModules();
	const components = getComponents();
	Object.keys(modules).forEach((key: string) => {
		const viewSrc = components[key];
		// console.log(viewSrc);
		const file = viewSrc.default;

		if (!file.isComponents) return

		const AsyncComponent = defineAsyncComponent(modules[key])
		app.component(file.name, AsyncComponent)
	})
	// console.log(app._component)
}