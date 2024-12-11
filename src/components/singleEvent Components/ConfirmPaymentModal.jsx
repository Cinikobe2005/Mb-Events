import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ActionBtn from "../ActionBtn";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import { toast } from "react-toastify";

const ConfirmPaymentModal = ({
  showModal,
  setShowModal,
  vipPrice,
  regularPrice,
  free,
}) => {
  // State to hold the ticket counts
  const [vipCount, setVipCount] = useState(0);
  const [regularCount, setRegularCount] = useState(0);

  // Calculate total ticket counts and price
  const totalTickets = vipCount + regularCount;
  const totalPrice = vipCount * vipPrice + regularCount * regularPrice;

  // Function to increment/decrement ticket counts
  const handleVipChange = (type) => {
    setVipCount(type === "increase" ? vipCount + 1 : Math.max(vipCount - 1, 0));
  };

  const handleRegularChange = (type) => {
    setRegularCount(
      type === "increase" ? regularCount + 1 : Math.max(regularCount - 1, 0)
    );
  };
  const token = localStorage.getItem("mb-token");
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const url = "https://mb-events-adedayo.onrender.com/api/v1/events/pay";
  const redirect = useNavigate();
  const handlePayment = async () => {
    // id of the event
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${url}/${eventId}`, " ", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Payment completed Successfully");
        redirect("/your-events/attending");
      }
    } catch (error) {
      toast.error(error?.message);
      if (error && error.status === 400) {
        toast.error(error?.data.response?.data?.message, {
          autoClose: 10000,
          position: "top-center",
        });
        setIsLoading(false);
      }
      if (error && error.status === 401) {
        toast.error("Session expired, Login");
        redirect("/login");
        localStorage.removeItem("mb-token");
        localStorage.removeItem("user");
      }
    }

    // token
  };
  if (isLoading) {
    return (
      <Modal centered show={showModal}>
        <Loader height="150px" />
      </Modal>
    );
  }

  return (
    <Modal centered show={showModal} onHide={() => setShowModal(false)}>
      <div
        className="p-4 bg-black text-white rounded-2"
        style={{ height: "390px" }}
      >
        <div className="mb-5">
          <h1 className="fs-4 text-center">Select Ticket</h1>
        </div>
        {free ? (
          <div className="mt-4 d-flex justify-content-between align-items-center">
            <span style={{ width: "15%" }}>Tickets</span>
            <div className="counter d-flex gap-3">
              <button
                onClick={() => handleVipChange("decrease")}
                style={{ width: "24px", height: "24px" }}
                className="rounded-circle"
              >
                -
              </button>
              <span style={{ width: "20%" }}>{vipCount}</span>
              <button
                onClick={() => handleVipChange("increase")}
                style={{ width: "24px", height: "24px" }}
                className="rounded-circle"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* VIP Ticket Section */}
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <span style={{ width: "15%" }}>VIP</span>
              <div className="counter d-flex gap-3 ">
                <button
                  onClick={() => handleVipChange("decrease")}
                  style={{ width: "24px", height: "24px" }}
                  className="rounded-circle"
                >
                  -
                </button>
                <span style={{ width: "20%" }}>{vipCount}</span>
                <button
                  onClick={() => handleVipChange("increase")}
                  style={{ width: "24px", height: "24px" }}
                  className="rounded-circle"
                >
                  +
                </button>
              </div>
              <span className="fw-bolder w-25 text-end">
                NGN {vipPrice * vipCount}
              </span>
            </div>

            {/* Regular Ticket Section */}
            <div className=" d-flex justify-content-between align-items-center mt-4">
              <span style={{ width: "15%" }}>Regular</span>
              <div className="counter d-flex gap-3 ">
                <button
                  onClick={() => handleRegularChange("decrease")}
                  style={{ width: "24px", height: "24px" }}
                  className="rounded-circle"
                >
                  -
                </button>
                <span style={{ width: "20%" }}>{regularCount}</span>
                <button
                  onClick={() => handleRegularChange("increase")}
                  style={{ width: "24px", height: "24px" }}
                  className="rounded-circle"
                >
                  +
                </button>
              </div>
              <span className="fw-bolder w-25 text-end">
                NGN {regularPrice * regularCount}
              </span>
            </div>

            <hr />

            {/* Total Section */}
            <div className="d-flex justify-content-between align-items-center my-4">
              <span>Total</span>
              <span className="fw-bolder">NGN {totalPrice}</span>
            </div>
          </div>
        )}{" "}
        {free ? (
          <ActionBtn
            content={"Get Ticket"}
            width={"100%"}
            className={vipCount <= 0 ? "bg-secondary mt-5" : "herobtn mt-5"}
            disable={vipCount <= 0}
            cursor={vipCount <= 0 ? "not-allowed" : "pointer"}
            handleClick={handlePayment}
          />
        ) : (
          <ActionBtn
            content={"Proceed To Payment"}
            width={"100%"}
            className={totalPrice <= 0 ? "bg-secondary mt-5" : "herobtn mt-5"}
            disable={totalPrice <= 0}
            cursor={totalPrice <= 0 ? "not-allowed" : "pointer"}
            handleClick={handlePayment}
          />
        )}
      </div>
    </Modal>
  );
};

export default ConfirmPaymentModal;
