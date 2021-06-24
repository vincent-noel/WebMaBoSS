import libsbml

def parseLayout(filename):
    
    reader  = libsbml.SBMLReader()
    sbmlDoc = reader.readSBML(filename)
    sbmlModel = sbmlDoc.getModel()
    layoutModel = sbmlModel.getPlugin("layout")
    
    if layoutModel is not None:
        layout = layoutModel.getLayout(0)
        dimensions = layout.getDimensions()
        dims = (dimensions.getWidth(), dimensions.getHeight())
        
        species_infos = {}
        for species in layout.getListOfAdditionalGraphicalObjects():
            
            specie_info = {}
            bb = species.getBoundingBox()
            specie_info['pos'] = (bb.getX(), bb.getY())
            specie_info['dim'] = (bb.getWidth(), bb.getHeight())
            
            species_infos.update({species.getReferenceId(): specie_info})
        
        return dims, species_infos
    