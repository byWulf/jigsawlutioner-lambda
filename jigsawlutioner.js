const Jigsawlutioner = require('jigsawlutioner');

exports.parseImage = async (event, context, callback) => {
    try {
        let borderData = await Jigsawlutioner.BorderFinder.findPieceBorder(Buffer.from(event.imageData, 'base64'), {
            threshold: event.threshold || 225,
            reduction: event.reduction || 2,
            returnTransparentImage: !!event.returnTransparentImage
        });

        let sideData = await Jigsawlutioner.SideFinder.findSides(event.pieceIndex, borderData.path);

        callback(null, Jigsawlutioner.PieceHelper.getLimitedPiece(borderData, sideData));
    } catch (err) {
        callback(err);
    }
};

exports.getPlacements = (event, context, callback) => {
    callback(null, Jigsawlutioner.Matcher.getPlacements(event.pieces, null, {
        ignoreMatches: event.ignoreMatches
    }));
};

exports.findExistingPieceIndex = (event, context, callback) => {
    callback(null, Jigsawlutioner.Matcher.findExistingPieceIndex(event.pieces, event.piece));
};