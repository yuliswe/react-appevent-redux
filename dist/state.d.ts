import { Immutable, Modifier } from "./immutable";
export declare abstract class AppState implements Immutable {
    assignProps(props: any): void;
    mapState<X extends this>(modifier: Modifier<X>): X;
    copy(): this;
}
//# sourceMappingURL=state.d.ts.map