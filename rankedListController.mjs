import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as albums from './rankedListModel.mjs';

const app = express()
app.use(express.json())

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    await albums.connect(false);
    console.log(`Server listening on port ${PORT}...`);
})

app.post('/rankings', asyncHandler(async(req,res) => {
    console.log("Recieved a POST request")
    const title = req.body.title
    const artists = req.body.artists
    const producers = req.body.producers
    const releaseYear = req.body.releaseYear
    const ranking = req.body.ranking
    const notes = req.body.notes
    
    if(notes)
    {
        const addedAlbum = await albums.createAlbumRanking(title, artists, producers, releaseYear, ranking, notes)
        res.status(201).json(addedAlbum)
    }
    else 
    {
        const addedAlbum = await albums.createAlbumRanking(title, artists, producers, releaseYear, ranking)
        res.status(201).json(addedAlbum)
    }
    console.log("Responded with JSON for new ranking")
}))

app.get('/rankings', asyncHandler(async(req,res) => {
    console.log("Recieved a GET request")
    console.log("Responded with JSON for all rankings")
    const filter = req.query
    const albumList = await albums.getRankings(filter)
    res.status(200).json(albumList)
}))

app.get('/rankings/:_id', asyncHandler(async(req,res) => {
    console.log("Recieved a GET request")
    console.log("Responded with JSON for the searched for ranking")
    const searchId = req.params['_id']
    const albumList = await albums.getAlbumRanking(searchId)
    if (albumList) 
    {
        res.status(200).json(albumList)
    }
    else 
    {
        res.status(404).json({"Error": "Not Found"})
    }
}))

app.put('/rankings/:_id', asyncHandler(async(req,res) => {
    console.log("Recieved a PUT request")
    console.log("Responded with JSON for updated ranking")
    const valuesToChange = req.body
    const searchId = req.params['_id']
    const albumToUpdate = await albums.getAlbumRanking(searchId)
    const modifiedCount = await albums.updateAlbumRanking(searchId, valuesToChange)
    const updatedAlbum  = await albums.getAlbumRanking(searchId)

    if (!albumToUpdate && modifiedCount === 0) 
    {
        res.status(404).json({"Error": "Not Found"})
    }
    else 
    {
        res.status(200).json(updatedAlbum)
    }
}))

app.delete('/rankings/:_id', asyncHandler(async(req,res) => {
    console.log("Recieved a DELETE request")
    console.log("Deleted entry. Responded with empty JSON body")
    const searchId = req.params['_id']
    const modifiedCount = await albums.deleteAlbumRanking(searchId)
    if (modifiedCount === 0) 
    {
        res.status(404).json({"Error": "Not Found"})
    }
    else 
    {
        res.status(204).json()
    }
}))