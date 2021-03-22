import React from "react";
import { shallow } from "enzyme";
import RenderDate from "@/components/common/RenderDate";

let props = {};

const setupProps = () => {
  props = {
    id: 1,
    input: {
      onChange: () => {},
    },
    label: "",
    placeholder: "yyyy-mm-dd",
    onChange: jest.fn((date) => date),
    meta: {
      touched: false,
      error: false,
      warning: false,
    },
  };
};

beforeEach(() => {
  setupProps();
});

describe("RenderDate", () => {
  it("renders properly", () => {
    const wrapper = shallow(<RenderDate {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
