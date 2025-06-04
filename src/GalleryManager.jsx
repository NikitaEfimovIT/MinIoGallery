import React, { useEffect, useState } from "react";
import {deleteImage , getImages , putFile} from "./api.js";
import {Box , Button , Container , Input} from "@mui/material";

export default function GalleryManager() {
    const [imageKeys, setImageKeys] = useState([]);
    const [signedUrls, setSignedUrls] = useState({});

    useEffect( ()=>{
        getImages(setImageKeys, setSignedUrls).catch(e=>console.log(e))
    }, [])

    return (
        <Container maxWidth={"xl"}>
            <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"}>
                <h1>MinIO Gallery</h1>
                <Button variant="contained" component="label" style={{height: 50}}>
                    {"Add new image"}
                    <Input
                        style={{display: "none"}}
                        type="file"
                        onChange={(evt) => putFile(evt, null, setImageKeys, setSignedUrls)}
                    />
                </Button>
            </Box>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {imageKeys.map((key) => (
                    <div key={key} style={{ position: "relative", textAlign: "center" }}>
                        <img
                            src={signedUrls[key]}
                            alt={key}
                            style={{ width: 300, height:500, objectFit: "cover" }}
                        />
                        <div>
                            <Button
                                variant={"contained"}
                                onClick={() => deleteImage(key, setImageKeys, setSignedUrls)}
                                style={{
                                    marginTop: 4,
                                    background: "#e74c3c",
                                    color: "#fff",
                                    boxShadow: "none"
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                variant={"outlined"}
                                style={{
                                    marginTop: 4,
                                    marginLeft: 8,
                                    cursor: "pointer",
                                    color: "#2980b9",
                                }}
                            >
                                Replace
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(evt) => putFile(evt, key, setImageKeys, setSignedUrls)}
                                />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}
