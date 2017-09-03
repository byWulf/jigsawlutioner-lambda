const Jigsawlutioner = require('jigsawlutioner');

exports.parseImage = (event, context, callback) => {
    let borderData = null;
    Jigsawlutioner.BorderFinder.findPieceBorder(Buffer.from(event.imageData, 'base64'), {
        threshold: event.threshold || 225
    }).then((borderResult) => {
        borderData = borderResult;
        return Jigsawlutioner.SideFinder.findSides(event.pieceIndex, borderData.path);
    }).then((piece) => {
        callback(null, {
            pieceIndex: piece.pieceIndex,
            sides: piece.sides,
            diffs: piece.diffs,
            boundingBox: borderData.boundingBox,
            dimensions: borderData.dimensions
        });
    }).catch((err) => {
        callback(err);
    });
};

exports.getPlacements = (event, context, callback) => {
    callback(null, Jigsawlutioner.Matcher.getPlacements(event.pieces));
};