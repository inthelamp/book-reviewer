import renderer from "react-test-renderer";
import Message from "../components/Message";
import "../components/Message.css";

it("Component: Message rendering correctly", () => {
  const message = "Pass successfully";
  const messageStyle = "success_message";

  const tree = renderer
    .create(<Message message={message} messageStyle={messageStyle} />)
    .toJSON();
  expect(tree).toMatchInlineSnapshot(`
    Array [
      <br />,
      <br />,
      <label
        className="success_message form-label"
      >
        Pass successfully
      </label>,
    ]
  `);
});
