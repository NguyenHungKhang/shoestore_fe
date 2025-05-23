import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import format from "date-fns/format";
import LoadingPage from "../../../components/common/components/LoadingPage";
import NumberFormat from "../../../utils/NumberFormat";
import CommentProduct from "./CommentProduct";

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token");
            const response = await axios.get(`https://shoestore-be.onrender.com/order/owner/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },)
            if (response.data.status === 200) {
                setOrder(response.data?.data)
            }

        }
        fetchData();
    }, [])

    const handleRePay = async () => {
        try {
            const token = Cookies.get("token");
            await axios.get(`https://shoestore-be.onrender.com/order/repay/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },).then(value => window.open(value.data?.data, "_self"))
        } catch (err) {
            console.log(err);
        }
    }

    return !order ? (<LoadingPage />) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography fontWeight={650}>
                                    Chi tiết đơn hàng
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Mã đơn hàng:
                                    </Typography>
                                    <Typography>
                                        {order._id}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Thời gian đặt hàng:
                                    </Typography>
                                    <Typography>
                                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Nhận tại:
                                    </Typography>
                                    <Typography>
                                        {order.isReceiveAtStore === true ? "Nhận tại cửa hàng" : `${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Trạng thái hóa đơn:
                                    </Typography>
                                    <Typography>
                                        {order.status === "pending" && "Chờ xác nhận"}
                                        {order.status === "confirmed" && "Đã xác nhận"}
                                        {order.status === "completed" && "Đã giao hàng"}
                                        {order.status === "shipping" && "Đang giao hàng"}
                                        {order.status === "cancelled" && "Đã hủy"}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography fontWeight={650}>
                                    Thông tin khách hàng
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Tên khách hàng:
                                    </Typography>
                                    <Typography>
                                        {order.customer.name}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Số điện thoại khách hàng:
                                    </Typography>
                                    <Typography>
                                        {order.customer.phone}
                                    </Typography>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography fontWeight={650}>
                                    Thanh toán đơn hàng
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Hình thức thanh toán:
                                    </Typography>
                                    <Typography>
                                        {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán qua VNPAY"}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Trạng thái thanh toán:
                                    </Typography>
                                    <Typography>
                                        {order.paymentStatus === "pending" && "Chưa thanh toán"}
                                        {order.paymentStatus === "paid" && "Đã thanh toán"}
                                        {order.paymentStatus === "cancelled" && "Đã hủy"}
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
                                    {order.paymentStatus === "pending" &&
                                        order.paymentMethod === "vnpay" &&
                                        <Button variant="outlined" onClick={handleRePay}>Thanh toán</Button>}
                                </Grid>
                                <Divider sx={{ my: 1 }} />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Tổng tiền sản phẩm:
                                    </Typography>
                                    <Typography>
                                        <NumberFormat number={order.subTotal} /> VNĐ
                                    </Typography>
                                </Grid>
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Khuyến mãi:
                                    </Typography>
                                    <Typography>
                                        {order.discountCode && "(Mã: " + order.discountCode + ") "}  <NumberFormat number={order.discount} /> VNĐ
                                    </Typography>
                                </Grid>
                                <Divider />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={650}>
                                        Tổng tiền:
                                    </Typography>
                                    <Typography>
                                        <NumberFormat number={order.total} /> VNĐ
                                    </Typography>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
            <Grid item xs={6}>
                {order.items.map((item, index) => {
                    return (
                        <Grid
                            container
                            sx={{
                                backgroundColor: "white",
                                marginTop: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                            }}
                            spacing={1}
                            key={index}
                        >
                            <Grid item lg={2} md={3} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img src={item.thumbnail} height={100} width={100} style={{ margin: 10 }} />
                            </Grid>
                            <Grid
                                item
                                lg={7}
                                md={6}
                                sm={12}
                            >
                                <Typography fontWeight={650}>{item.productId.name} {item.variantName} </Typography>
                                <Typography>Số lượng: {item.quantity} </Typography>
                            </Grid>
                            <Grid
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                }}
                            >

                                {/* <Button
                                    sx={{
                                        fontSize: "12px",
                                        textTransform: "none",
                                        color: "#609af8",
                                        width: "100%",
                                        mr: 1,
                                        mb: 1
                                    }}
                                    variant="outlined"
                                >
                                    Đánh giá sản phẩm
                                </Button> */}
                                <CommentProduct data={item} />
                            </Grid>
                        </Grid>
                    );
                })}

            </Grid>
        </Grid>
    );
}

export default OrderDetail;