import { useState } from "react";

function MyNewUpload() {

    const [title, setTitle] = useState("");

    const upload = () => {

        fetch("http://192.168.1.9:8080/api/resources/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                subject: "DBMS",
                category: "Handwritten",
                description: "notes",
                filePath: "files/test.pdf",
                uploadedBy: 6
            })
        })

    }

    return (

        <div>

            <h2>Upload Resources</h2>

            <input
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={upload}>Upload</button>

        </div>

    )

}

export default MyNewUpload