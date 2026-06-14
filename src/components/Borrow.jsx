import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Pagination,
  Divider,
  Chip,
} from "@mui/material";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaCog,
  FaPlus,
  FaCheck,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";

import { api } from "../utils/api";

function Borrow() {
 const rawRole = localStorage.getItem("role") || ""; 
  const role = rawRole.trim().toLowerCase();

  const [borrows, setBorrows] = useState([]);
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    readerId: "",
    bookId: "",
    borrowDate: "",
    dueDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("vi-VN");
    } catch (err) {
      return "N/A";
    }
  };

  const loadBorrows = async () => {
    try {
      const data = await api.borrows.search("", "", currentPage - 1, perPage);
      setBorrows(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi tải phiếu mượn:", err);
    }
  };

  useEffect(() => {
    loadBorrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadSelectData = async () => {
    try {
      const readersRes = await api.readers.search("", 0, 1000);
      const booksRes = await api.books.search("", "", 0, 1000);
      setReaders(readersRes.content || []);
      
      // Filter out of stock books
      setBooks(booksRes.content || []);

      setForm({
        readerId: readersRes.content?.[0]?.id || "",
        bookId: booksRes.content?.[0]?.id || "",
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mặc định 14 ngày
      });
    } catch (err) {
      console.error("Lỗi khi tải danh sách độc giả / sách:", err);
    }
  };

  const openModal = () => {
    loadSelectData();
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setForm({
      readerId: "",
      bookId: "",
      borrowDate: "",
      dueDate: "",
    });
  };

  const saveBorrow = async () => {
    if (!form.readerId || !form.bookId || !form.borrowDate || !form.dueDate) {
      alert("Nhập đầy đủ thông tin!");
      return;
    }

    try {
      // Ensure dates are properly formatted (YYYY-MM-DD or ISO string)
      const borrowDateObj = new Date(form.borrowDate);
      const dueDateObj = new Date(form.dueDate);
      
      if (isNaN(borrowDateObj.getTime()) || isNaN(dueDateObj.getTime())) {
        alert("Định dạng ngày không hợp lệ!");
        return;
      }

      await api.borrows.create({
        readerId: Number(form.readerId),
        bookId: Number(form.bookId),
        borrowDate: borrowDateObj.toISOString().split('T')[0],
        dueDate: dueDateObj.toISOString().split('T')[0],
      });
      loadBorrows();
      closeModal();
    } catch (err) {
      alert(err.message || "Lỗi khi mượn sách. Hãy chắc chắn sách vẫn còn trong kho.");
    }
  };

  const returnBook = async (id) => {
    try {
      await api.borrows.returnBook(id);
      loadBorrows();
    } catch (err) {
      alert(err.message || "Lỗi khi trả sách");
    }
  };

  const deleteBorrow = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phiếu mượn?")) {
      try {
        await api.borrows.delete(id);
        loadBorrows();
      } catch (err) {
        alert(err.message || "Lỗi khi xóa phiếu mượn");
      }
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: "#171654",
            color: "white",
            p: 2,
            boxSizing: "border-box",
          },
        }}
      >
        <Box>
          {/* LOGO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <MdMenuBook size={46} color="#facc15" />
            <Typography sx={{ fontSize: 40, fontWeight: "bold" }}>
              LibZone
            </Typography>
          </Box>

          {/* MENU */}
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/home"
                sx={{ borderRadius: 2, mb: 1, py: 1.1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <FaBook />
                </ListItemIcon>
                <ListItemText
                  primary="Tổng quan"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/book"
                sx={{ borderRadius: 2, mb: 1, py: 1.1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <FaBook />
                </ListItemIcon>
                <ListItemText
                  primary="Quản lý sách"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>

            {/* READER */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/reader"
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <FaUsers />
                </ListItemIcon>
                <ListItemText
                  primary="Quản lý độc giả"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/borrow" sx={{ borderRadius: 2, mb: 1, py: 1.1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <FaExchangeAlt />
                </ListItemIcon>
                <ListItemText
                  primary="Mượn / Trả sách"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>

            {role === "admin" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/person" sx={{ borderRadius: 2, mb: 1, py: 1.1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <FaUser />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quản lý nhân sự"
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>

        {/* BOTTOM */}
        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/settings" sx={{ borderRadius: 2, py: 1.1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <FaCog />
                </ListItemIcon>
                <ListItemText
                  primary="Cài đặt"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Mượn / Trả sách
            </Typography>
            <Typography color="gray">Quản lý phiếu mượn sách</Typography>
          </Box>
          <Button variant="contained" startIcon={<FaPlus />} onClick={openModal}>
            Tạo phiếu mượn
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã phiếu</TableCell>
                <TableCell align="center">Độc giả</TableCell>
                <TableCell align="center">Sách</TableCell>
                <TableCell align="center">Ngày mượn</TableCell>
                <TableCell align="center">Hạn trả</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {borrows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell align="center">{b.id}</TableCell>
                  <TableCell align="center">{b.readerName}</TableCell>
                  <TableCell align="center">{b.bookTitle}</TableCell>
                  <TableCell align="center">{formatDate(b.borrowDate)}</TableCell>
                  <TableCell align="center">{formatDate(b.dueDate)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={b.status}
                      color={
                        b.status === "Đã trả"
                          ? "success"
                          : b.status === "Quá hạn"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(b.status === "Đang mượn" || b.status === "Quá hạn") && (
                      <Button color="success" onClick={() => returnBook(b.id)}>
                        <FaCheck />
                      </Button>
                    )}
                    <Button color="error" onClick={() => deleteBorrow(b.id)}>
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>

        {/* MODAL */}
        <Dialog open={open} onClose={closeModal} fullWidth>
          <DialogTitle>Tạo phiếu mượn</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Độc giả"
              margin="normal"
              value={form.readerId}
              onChange={(e) => setForm({ ...form, readerId: e.target.value })}
            >
              {readers.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.fullName} (Mã: {r.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Sách"
              margin="normal"
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
            >
              {books.map((b) => (
                <MenuItem key={b.id} value={b.id} disabled={b.currentQuantity <= 0}>
                  {b.title} (Sẵn có: {b.currentQuantity} / {b.totalQuantity})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="date"
              margin="normal"
              label="Ngày mượn"
              InputLabelProps={{ shrink: true }}
              value={form.borrowDate}
              onChange={(e) => setForm({ ...form, borrowDate: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              margin="normal"
              label="Hạn trả"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Hủy</Button>
            <Button variant="contained" onClick={saveBorrow}>Lưu</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default Borrow;