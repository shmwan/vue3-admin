import { RectNode, RectNodeModel, h } from "@logicflow/core";

class UserTaskView extends RectNode {
  getLabelShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const style = model.getNodeStyle();
    return h(
      "svg",
      {
        x: x - width / 2 + 5,
        y: y - height / 2 + 5,
        width: 25,
        height: 25,
        viewBox: "0 0 1274 1024"
      },
      [
        h("path", {
          fill: style.stroke,
          d:
            "M943.698093 792.31222 574.317301 422.932452c36.332487-92.849688 16.147772-203.865107-58.535161-278.549064-80.738859-80.738859-201.847148-96.886631-298.733778-50.461275l175.606507 175.606507L269.52862 392.655891 93.922113 217.048361c-46.424332 96.886631-30.27656 217.994919 50.461275 298.733778 74.682933 74.682933 185.699376 94.867648 278.549064 58.535161l369.379769 369.379769c16.147772 16.147772 42.387389 16.147772 56.517201 0l94.867648-94.867648C959.845865 834.700633 959.845865 808.459992 943.698093 792.31222z"
        }),
      ]
    );
  }
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, radius } = model;
    const style = model.getNodeStyle();
    return h("g", {}, [
      h("rect", {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height
      }),
      this.getLabelShape()
    ]);
  }
}

class UserTaskModel extends RectNodeModel {
  setAttributes() {
    this.width = 120;
    this.height = 80;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 12;
    style.color = "#787A86";
    return style;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "#FF7917";
    style.fill = "rgba(255, 121, 23, 0.30)";
    
    return style;
  }
  getAnchorStyle() {
    const style = super.getAnchorStyle();
    style.stroke = "rgb(24, 125, 255)";
    style.r = 3;
    style.hover.r = 8;
    style.hover.fill = "rgba(255, 121, 23, 0.30)";
    style.hover.stroke = "rgb(24, 125, 255)";
    return style;
  }
  getAnchorLineStyle() {
    const style = super.getAnchorLineStyle();
    style.stroke = "rgb(24, 125, 255)";
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "red";
    style.hover.stroke = "red";
    return style;
  }
}

export default {
  type: "realTask",
  view: UserTaskView,
  model: UserTaskModel
};



