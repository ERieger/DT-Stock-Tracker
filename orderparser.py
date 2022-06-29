from rectpack import newPacker, PackingMode

class OrderParser:
    # Calculate the number of sheets required for the order
    def calculate_sheets(self, sheet_dim, pieces):
        packer = newPacker(PackingMode.Offline, True)

        packer.add_bin(sheet_dim[0], sheet_dim[1], count=float('inf'))

        for p in pieces:
            packer.add_rect(*p)

        packer.pack()

        return len(packer)

    # Expanding the object of pieces into an array of rectangles
    def expand(self, pieces):
        piece_list = []
        for p in pieces:
            for _ in range(p['qty']):
                piece_list.append((int(p['w']), int(p['l'])))

        return sorted(piece_list)

    # takes the material entry from the database plus a list of pieces
    def calculate_material_costs(self, material, pieces):
        material_entry = {}

        material_price = material['price']
        price = 0

        if (material['type'] == 1): # The material is in sheet form
            area = 0
            sheets = 0

            for p in pieces:
                area = area + (p['w']*p['l']*p['qty'])

            sheet_dim = (material['dim']['w'], material['dim']['l'])
            sheets = self.calculate_sheets(sheet_dim, self.expand(pieces))

            price = sheets * material_price

            material_entry['sheets'] = sheets
            material_entry['area'] = area
        
        else: # The material is in plank or dowel form
            length = 0

            for p in pieces:
                length = length + (p['l']*p['qty'])

            price = (length/1000) * material_price # (length is in millimetres, price is per metre)

            material_entry['l'] = length

        material_entry['price'] = price
        material_entry['type'] = material['type']
        material_entry['pieces'] = pieces

        return material_entry
    
    # Extracting pieces from a classes' projects
    def extract_class_pieces(self, projects):
        pieces = []

        for project in projects:
            for piece in project['pieces']:
                pieces.append(piece)
        
        collated_list = {}

        for piece in pieces:
            collated_list[piece['material']] = []
            newpiece = {}
            newpiece['qty'] = piece['qty']
            newpiece['l'] = piece['l']

            if (piece['type'] == 1): # Unique to sheets
                newpiece['w'] = piece['w']
            
            collated_list[piece['material']].append(newpiece)

        return collated_list
