import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
} from "react-icons/fa";

import { MdMenuBook } from "react-icons/md";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // REGISTER
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // CHECK EMPTY
    if (
      !form.email ||
      !form.password
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin"
      );
      return;
    }

    try {
      await api.auth.register(form.email.trim(), form.password, "staff");
      
      setSuccess("Đăng ký thành công");

      // RESET FORM
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // REDIRECT LOGIN
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Email đã tồn tại hoặc có lỗi.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 450,
          p: 5,
          borderRadius: "30px",
          border: "1px solid #eee",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "24px",
              bgcolor: "#171654",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <MdMenuBook
              size={50}
              color="#facc15"
            />
          </Box>

          <Typography
            variant="h3"
            fontWeight="bold"
          >
            LibZone
          </Typography>

          <Typography color="gray">
            Đăng ký tài khoản
          </Typography>
        </Box>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
            }}
          >
            {error}
          </Alert>
        )}

        {/* SUCCESS */}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: "12px",
            }}
          >
            {success}
          </Alert>
        )}

        {/* NAME */}
        <Box mb={3}>
          <Typography
            fontWeight="bold"
            mb={1}
          >
            Họ tên
          </Typography>

          <TextField
            fullWidth
            placeholder="Nhập họ tên"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser color="gray" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius: "16px",
                },
            }}
          />
        </Box>

        {/* EMAIL */}
        <Box mb={3}>
          <Typography
            fontWeight="bold"
            mb={1}
          >
            Email
          </Typography>

          <TextField
            fullWidth
            placeholder="Nhập email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaEnvelope color="gray" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius: "16px",
                },
            }}
          />
        </Box>

        {/* PASSWORD */}
        <Box mb={4}>
          <Typography
            fontWeight="bold"
            mb={1}
          >
            Mật khẩu
          </Typography>

          <TextField
            fullWidth
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock color="gray" />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius: "16px",
                },
            }}
          />
        </Box>

        {/* BUTTON */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleRegister}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: "16px",
            fontSize: 18,
            textTransform: "none",
            bgcolor: "#171654",

            "&:hover": {
              bgcolor: "#0f0f3d",
            },
          }}
        >
          Đăng ký
        </Button>

        {/* LOGIN */}
        <Typography
          textAlign="center"
          mt={3}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/"
            style={{
              color: "#4f46e5",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Đăng nhập
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;