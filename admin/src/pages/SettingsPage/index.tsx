import {
  Box,
  Button,
  HeaderLayout,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  IconButton,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  TextInput,
  Select,
  Option,
  Flex,
  EmptyStateLayout,
  Alert,
} from "@strapi/design-system";
import { Trash } from "@strapi/icons";
import { useEffect, useState } from "react";
import { useFetchClient } from "@strapi/helper-plugin";
import * as Icons from "@strapi/icons";
import { Pencil } from "@strapi/icons";

type Item = {
  id?: number;
  title: string;
  url: string;
  icon: string;
};

const iconOptions = Object.keys(Icons).sort();

const SettingsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [formType, setFormType] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<Item>({ title: "", url: "", icon: "Book" });

  const { get, post, put, del } = useFetchClient();

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState<string>("");

  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );

  useEffect(() => {
    fetchItems();

    // check url params for alert message
    const urlParams = new URLSearchParams(window.location.search);
    const alertMessage = urlParams.get("alert");
    if (alertMessage && alertMessage !== "") {
      setAlert(decodeURIComponent(alertMessage));
    }
  }, []);

  useEffect(() => {
    if (!showModal) {
      // Reset form when modal is opened
      setForm({ title: "", url: "", icon: "Book" });
    }
  }, [showModal]);

  useEffect(() => {
    if (!alert || alert === "") return;

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [alert, setAlert]);

  useEffect(() => {
    if (!isLocalhost) {
      setAlert(
        "This interface only works in development mode (localhost). Editing webviews is disabled in production."
      );
    }
  }, [isLocalhost]);

  const fetchItems = async () => {
    try {
      const response = await get("/webviews");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      await post("/webviews", { data: form });
      setShowModal(false);
      setForm({ title: "", url: "", icon: "Book" });
      fetchItems();

      const params = new URLSearchParams(window.location.search);
      params.set(
        "alert",
        "Webview created successfully! Restart the server to generate the new permissions."
      );
      window.location.href = `${window.location.pathname}?${params.toString()}`;
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  const handleEdit = (item: Item) => {
    setForm(item);
    setFormType("edit");
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await put(`/webviews/${form.id}`, { data: form });
      setShowModal(false);
      setForm({ title: "", url: "", icon: "Book" });
      fetchItems();
      const params = new URLSearchParams(window.location.search);
      params.set(
        "alert",
        "Webview updated successfully! Restart the server to generate the updated permissions."
      );
      window.location.href = `${window.location.pathname}?${params.toString()}`;
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await del(`/webviews/${id}`, { method: "DELETE" });
      fetchItems();

      const params = new URLSearchParams(window.location.search);
      params.set(
        "alert",
        "Webview updated successfully! Restart the server to generate the updated permissions."
      );
      window.location.href = `${window.location.pathname}?${params.toString()}`;
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const Icon = Icons[form.icon as keyof typeof Icons];

  return (
    <>
      <Box background="neutral100" position="relative">
        {showAlert && (
          <Box
            padding={4}
            position="absolute"
            top={6}
            left={0}
            width="100%"
            zIndex={1000}
          >
            <Alert
              closeLabel="Close the alert"
              title="Information:"
              variant="info"
              onClose={() => setShowAlert(false)}
            >
              {alert}
            </Alert>
          </Box>
        )}

        <HeaderLayout
          title="Webviews"
          subtitle="Manage your webviews"
          as="h2"
          primaryAction={
            isLocalhost && (
              <Button onClick={() => setShowModal(true)}>
                Add new webview
              </Button>
            )
          }
        />
        {/* Display items in a table */}
        {items.length > 0 && (
          <Box paddingLeft={10} paddingRight={10}>
            <Table colCount={4} rowCount={items.length}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography variant="sigma">Icon</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Title</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">URL</Typography>
                  </Th>
                  {isLocalhost && (
                    <Th>
                      <Typography variant="sigma">Actions</Typography>
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item: Item, index) => {
                  const Icon = Icons[item.icon as keyof typeof Icons];
                  return (
                    <Tr
                      key={index}
                      onClick={() => handleEdit(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <Td>
                        {Icon ? (
                          <Box padding={1}>
                            <Icon fill="primary100" />
                          </Box>
                        ) : null}
                      </Td>
                      <Td>
                        <Typography>{item.title}</Typography>
                      </Td>
                      <Td>
                        <Typography variant="pi" textColor="primary600">
                          {item.url}
                        </Typography>
                      </Td>
                      {isLocalhost && (
                        <Td>
                          <Flex>
                            <IconButton
                              onClick={() => handleEdit(item)}
                              label="Edit"
                              icon={<Pencil />}
                              noBorder
                            />
                            <IconButton
                              onClick={() => handleDelete(item.id!)}
                              label="Delete"
                              icon={<Trash />}
                              noBorder
                            />
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
        {/* EmptyState */}
        {items.length === 0 && (
          <Box padding={10}>
            <EmptyStateLayout
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10rem"
                  height="1rem"
                  fill="none"
                  viewBox="0 0 216 120"
                >
                  <g clip-path="url(#EmptyDocuments_svg__a)" opacity="0.84">
                    <path
                      fill="#D9D8FF"
                      fill-opacity="0.8"
                      fill-rule="evenodd"
                      d="M189.25 19.646a7.583 7.583 0 0 1 0 15.166h-43.333a7.583 7.583 0 0 1 0 15.167h23.833a7.583 7.583 0 0 1 0 15.167h-11.022c-5.28 0-9.561 3.395-9.561 7.583 0 1.956 1.063 3.782 3.19 5.48 2.017 1.608 4.824 1.817 7.064 3.096a7.583 7.583 0 0 1-3.754 14.174H65.75a7.583 7.583 0 0 1 0-15.166H23.5a7.583 7.583 0 1 1 0-15.167h43.333a7.583 7.583 0 1 0 0-15.167H39.75a7.583 7.583 0 1 1 0-15.166h43.333a7.583 7.583 0 0 1 0-15.167H189.25Zm0 30.333a7.583 7.583 0 1 1 0 15.166 7.583 7.583 0 0 1 0-15.166Z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      d="m132.561 19.646 10.077 73.496.906 7.374a4.334 4.334 0 0 1-3.773 4.829l-63.44 7.789a4.333 4.333 0 0 1-4.83-3.772l-9.767-79.547a2.166 2.166 0 0 1 1.91-2.417l5.262-.59 63.655-7.162ZM73.162 26.33l4.97-.557-4.97.557Z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      stroke="#7B79FF"
                      stroke-width="2.5"
                      d="m73.162 26.33 4.97-.557m54.429-6.127 10.077 73.496.906 7.374a4.334 4.334 0 0 1-3.773 4.829l-63.44 7.789a4.333 4.333 0 0 1-4.83-3.772l-9.767-79.547a2.166 2.166 0 0 1 1.91-2.417l5.262-.59 63.655-7.162Z"
                    ></path>
                    <path
                      fill="#F0F0FF"
                      fill-rule="evenodd"
                      d="m129.818 24.27 9.122 66.608.82 6.682c.264 2.153-1.246 4.11-3.373 4.371l-56.812 6.976c-2.127.261-4.066-1.272-4.33-3.425l-8.83-71.908a2.167 2.167 0 0 1 1.887-2.415l7.028-.863"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      fill="#fff"
                      fill-rule="evenodd"
                      stroke="#7B79FF"
                      stroke-width="2.5"
                      d="M135.331 5.833H85.978a2.97 2.97 0 0 0-2.107.873A2.97 2.97 0 0 0 83 8.813v82.333c0 .823.333 1.567.872 2.106a2.97 2.97 0 0 0 2.107.873h63.917a2.97 2.97 0 0 0 2.106-.873 2.97 2.97 0 0 0 .873-2.106V23.367a2.98 2.98 0 0 0-.873-2.107L137.437 6.705a2.98 2.98 0 0 0-2.106-.872Z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      stroke="#7B79FF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M135.811 7.082v12.564a3.25 3.25 0 0 0 3.25 3.25h8.595M94.644 78.146h28.167m-28.167-55.25h28.167-28.167Zm0 13h46.584-46.584Zm0 14.083h46.584-46.584Zm0 14.084h46.584-46.584Z"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="EmptyDocuments_svg__a">
                      <path fill="#fff" d="M0 0h216v120H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              }
              content="No webviews found"
              action={
                <Button onClick={() => setShowModal(true)}>
                  Add new webview
                </Button>
              }
            />
          </Box>
        )}

        {/* Modal for adding/editing items */}
        {showModal && (
          <ModalLayout onClose={() => setShowModal(false)} labelledBy="title">
            <ModalHeader>
              <Typography
                fontWeight="bold"
                textColor="neutral800"
                as="h2"
                id="title"
              >
                {formType === "edit" ? `Edit webview: ${form.title}` : "Add a new webview" }
              </Typography>
            </ModalHeader>

            <ModalBody>
              <Box paddingBottom={4}>
                <TextInput
                  label="Title"
                  name="title"
                  required
                  maxLength={25}
                  onChange={(e: any) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  value={form.title}
                />
              </Box>
              <Box paddingBottom={4}>
                <TextInput
                  label="URL"
                  name="url"
                  required
                  onChange={(e: any) =>
                    setForm((f) => ({ ...f, url: e.target.value }))
                  }
                  value={form.url}
                />
              </Box>
              <Box>
                <Flex
                  alignItems="center"
                  gap={4}
                  justifyContent="space-between"
                >
                  <Select
                    label="Icon"
                    value={form.icon}
                    onChange={(value: any) =>
                      setForm((f) => ({ ...f, icon: value }))
                    }
                  >
                    {iconOptions.map((icon) => (
                      <Option key={icon} value={icon}>
                        {icon}
                      </Option>
                    ))}
                  </Select>

                  <Box paddingLeft={2} display="flex" alignItems="center">
                    <Flex gap={2} alignItems="center">
                      <Typography>Selected Icon:</Typography>
                      <Icon />
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </ModalBody>

            <ModalFooter
              startActions={
                <Button onClick={() => setShowModal(false)} variant="tertiary">
                  Cancel
                </Button>
              }
              endActions={
                <Button
                  onClick={() => {
                    if (formType === "edit") {
                      handleUpdate();
                    } else {
                      handleSubmit();
                    }
                  }}
                >
                  Save
                </Button>
              }
            />
          </ModalLayout>
        )}
      </Box>
    </>
  );
};

export default SettingsPage;
