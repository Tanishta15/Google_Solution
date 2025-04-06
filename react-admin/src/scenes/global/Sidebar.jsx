import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UploadModal from "../../components/UploadModal";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{ color: selected === title ? "#6870fa" : undefined }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarComponent = ({ isSidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: isSidebar ? "block" : "none",
          height: "100%",
        }}
      >
        <ProSidebar
          backgroundColor="#1F2A40"
          collapsed={isCollapsed}
          style={{
            height: "100%",
          }}
        >
          <Menu
            menuItemStyles={{
              button: {
                padding: "5px 35px 5px 20px",
                "&:hover": {
                  color: "#868dfb !important",
                },
                "&.active": {
                  color: "#6870fa !important",
                },
              },
              icon: {
                backgroundColor: "transparent !important",
              },
            }}
          >
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: "#e0e0e0",
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color="#e0e0e0">
                    ADMIN
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {/* USER */}
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`${process.env.PUBLIC_URL}/assets/user.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color="#e0e0e0"
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Admin User
                  </Typography>
                  <Typography variant="h5" color="#4cceac">
                    Admin
                  </Typography>
                </Box>
              </Box>
            )}

            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color="#a3a3a3"
                sx={{ m: "15px 0 5px 20px" }}
              >
                Data
              </Typography>
              <Item
                title="Bar Chart"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Pie Chart"
                to="/pie"
                icon={<PieChartOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Line Chart"
                to="/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Geography Chart"
                to="/geography"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color="#a3a3a3"
                sx={{ m: "15px 0 5px 20px" }}
              >
                Tools
              </Typography>
              <MenuItem icon={<UploadFileIcon />} onClick={handleUploadClick}>
                <Typography>Upload File</Typography>
              </MenuItem>
            </Box>
          </Menu>
        </ProSidebar>
      </Box>

      {/* Upload Modal */}
      <UploadModal open={uploadModalOpen} onClose={handleCloseUploadModal} />
    </>
  );
};

export default SidebarComponent;
