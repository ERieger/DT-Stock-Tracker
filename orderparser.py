# This script defines the class used to generate order reports
# This includes calculating price and material usage
# Methods:
#   calculate_sheets - calculate the number of sheets required to make a set of pieces
#   expand           - Converting the object of pieces from an order to the corrent format for the calculate_sheets method
#   calculate_material_costs - Calculating the cost of a given quantity of material
#   extract_class_pieces - extracing a list of pieces from a class list of projects

# The library used for the 'bin packing' algorithm for sheet calculation
from rectpack import newPacker, PackingMode
from datetime import datetime
import xlsxwriter

# The order parsing class
class OrderParser:
    # Calculate the number of sheets required for the order
    def calculate_sheets(self, sheet_dim, pieces):
        packer = newPacker(PackingMode.Offline, True)   # Make a new packer object

        packer.add_bin(sheet_dim[0], sheet_dim[1], count=float('inf'))  # Add an infinite amount of bins to the packing queue

        # Fill the rectangle (piece) queue
        for p in pieces:
            packer.add_rect(*p)

        packer.pack() # Pack the rectangles in the bin queue

        return len(packer)  # Return the number of bins consumed

    # Expanding the object of pieces into an array of rectangles
    def expand(self, pieces):
        piece_list = [] # An array of piece dimensions

        # Add a piece to the list for however many pieces are required
        for p in pieces:
            for _ in range(abs(p['qty'])):
                piece_list.append((abs(int(p['w'])), abs(int(p['l']))))

        return sorted(piece_list)   # Return the pices list, sorted by size

    # takes the material entry from the database plus a list of pieces
    def calculate_material_costs(self, material, pieces):
        material_entry = {}

        material_price = material['price']
        price = 0

        if (material['type'] == 1): # The material is in sheet form
            area = 0
            sheets = 0

            for p in pieces:
                area = area + abs((p['w']*p['l']*p['qty'])/1000000)

            # The dimensions of the sheet a material is ordered in
            sheet_dim = (abs(material['dim']['w']), abs(material['dim']['l']))

            # calculate the number of sheets required for this material order
            sheets = self.calculate_sheets(sheet_dim, self.expand(pieces))

            price = round(sheets * material_price, 2)

            material_entry['sheets'] = sheets
            material_entry['area'] = area
        
        else: # The material is in plank or dowel form
            length = 0

            for p in pieces:
                length = length + abs((p['l']*p['qty'])/1000)

            price = round((length) * material_price, 2) # (length is in millimetres, price is per metre)

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

    # Creating an excel document of the report report
    def create_excel_report(self, order):
        reportPath = f"./order_reports/DT_order-{datetime.date(datetime.now())}.xlsx"
        print(reportPath)

        workbook = xlsxwriter.Workbook(reportPath)
        worksheet = workbook.add_worksheet()

        worksheet.write(0,0, 'Hello, World!')

        workbook.close()