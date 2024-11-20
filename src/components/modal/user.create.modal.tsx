import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";

import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../config/key";

interface IUser {
    name: string;
    email: string;
}

const UserCreateModal = (props: any) => {
    const queryClient = useQueryClient();
    const { isOpenCreateModal, setIsOpenCreateModal } = props;

    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");

    const mutation = useMutation({
        mutationFn: async (payload: IUser) => {
            const res = await fetch("http://localhost:8000/users", {
                method: "POST",
                body: JSON.stringify({
                    email: payload.email,
                    name: payload.name,
                }),
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return res.json();
        },
        onSuccess: (data, variables, context) => {
            //Thông báo thành công
            toast("🦄 Wow so easy!");
            setIsOpenCreateModal(false); //đóng modal
            setEmail(""); //clear data
            setName(""); //clear data
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() }); //fetch lại data theo key
        },
    });

    const handleSubmit = () => {
        if (!email) {
            alert("email empty");
            return;
        }
        if (!name) {
            alert("name empty");
            return;
        }
        //call api => call redux
        mutation.mutate({ email, name });
        //toast("🦄 Wow so easy!");
    };

    return (
        <>
            <Modal
                show={isOpenCreateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={false}
                onHide={() => setIsOpenCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add A New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel label="Email" className="mb-3">
                        <Form.Control
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Name">
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    {!mutation.isPending ? (
                        <>
                            <Button
                                variant="warning"
                                onClick={() => setIsOpenCreateModal(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => handleSubmit()}>Save</Button>
                        </>
                    ) : (
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <> </>
                            Saving...
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserCreateModal;
