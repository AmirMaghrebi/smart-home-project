export type DeviceType = 'switch_1_channel' | 'door_opener';
export type Device = {
    id: string;
    name: string;
    type: DeviceType;
    status: 'on' | 'off';
    mac?: string;
};
declare const _default: import("vue").DefineComponent<{}, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
