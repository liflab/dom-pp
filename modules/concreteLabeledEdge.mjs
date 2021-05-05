class ConcreteLabeledEdge {
    constructor(node, q={EXACT, OVER, UNDER, NONE}) {
        //super();
        this.node = node;
        //q = {EXACT, OVER, UNDER, NONE};
        this.q = q;
    }

    getQuality() {
        return this.q;
    }

    getNode() {
        return this.node;
    }

    toString() {
        return this.node + ":" + this.q;
    }
}
export {ConcreteLabeledEdge}