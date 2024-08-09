'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameItem, setRenameItem] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const handleRenameItem = async () => {
    const oldItemRef = doc(collection(firestore, 'inventory'), renameItem.toLowerCase())
    const newItemRef = doc(collection(firestore, 'inventory'), itemName.toLowerCase())
    const docSnap = await getDoc(oldItemRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(newItemRef, {quantity})
      await deleteDoc(oldItemRef)
      setItemName('')
      setRenameItem('')
      setRenameOpen(false)
      await updateInventory()
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory)
    } else {
      setFilteredInventory(inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }
  }, [searchTerm, inventory])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleRenameOpen = (name) => {
    setRenameItem(name)
    setRenameOpen(true)
  }

  const handleRenameClose = () => {
    setRenameItem('')
    setItemName('')
    setRenameOpen(false)
  }

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      padding={3}
      bgcolor="#f5f5f5"
    >
      {/* Rename Item Modal */}
      <Modal open={renameOpen} onClose={handleRenameClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform:'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Rename Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              label="New Name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" onClick={handleRenameItem}>
              Rename
            </Button>
          </Stack>
        </Box>
      </Modal>
      
      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform:'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Main Content */}
      <Box width="100%" maxWidth="1200px" padding={3} bgcolor="#ffffff" borderRadius={2} boxShadow={3}>
        <Stack spacing={2} mb={2}>
          <TextField
            variant="outlined"
            label="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Add New Item
          </Button>
        </Stack>

        <Box
          width="100%"
          height="60px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={2}
          mb={2}
        >
          <Typography variant="h4" color="#333">
            Pantry Inventory
          </Typography>
        </Box>
      
        <Stack spacing={2} overflow="auto">
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              borderRadius={1}
              boxShadow={1}
              sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained"
                  color="success"
                  onClick={() => {
                    addItem(name)
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained"
                  color="error"
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  Remove
                </Button>
                <Button 
                  variant="contained"
                  color="info"
                  onClick={() => handleRenameOpen(name)}
                >
                  Rename
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
