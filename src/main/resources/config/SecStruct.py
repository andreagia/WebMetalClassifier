import os
import sys
import subprocess
import string
import argparse
from Bio.PDB import PDBParser
from Bio.PDB.DSSP import DSSP

parser = argparse.ArgumentParser(
    description='\n The program will extract DSSP secondary structure assignments.\n',
    epilog='\n \n',
    formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument(
    'input_file', help='path to the input PDB file [required]')
args = parser.parse_args()

try:
    dssp_loc = subprocess.check_output("which dssp", shell=True)
#    sys.stdout.write('\n dssp found at %s\n' % dssp_loc)
except Exception:
    sys.stdout.write('\n dssp not found. It is available for download from https://github.com/cmbi/dssp \n\n')
    sys.exit(1)

if os.access(args.input_file, os.R_OK):
    p = PDBParser()
    pdb_file = args.input_file
    pdb_code = args.input_file.rsplit('.', 1)[0]
    structure = p.get_structure(pdb_code, pdb_file)
    model = structure[0]
    dssp = DSSP(model, pdb_file)

    # Note that the recent DSSP executable from the DSSP-2 package was renamed from dssp to mkdssp. If using a recent DSSP release, you may need to provide the name of your DSSP executable:
    #dssp = DSSP(model, pdb_file, dssp='mkdssp')
    # DSSP data is accessed by a tuple - (chain id, residue id):
    # The dssp data returned for a single residue is a tuple in the form:
    #
    # Tuple Index   Value
    # 0     DSSP index
    # 1     Amino acid
    # 2     Secondary structure
    # 3     Relative ASA
    # 4     Phi
    # 5     Psi
    # 6     NH-->O_1_relidx
    # 7     NH-->O_1_energy
    # 8     O-->NH_1_relidx
    # 9     O-->NH_1_energy
    # 10    NH-->O_2_relidx
    # 11    NH-->O_2_energy
    # 12    O-->NH_2_relidx
    # 13    O-->NH_2_energy

    aa_key = ''
    ss_key = ''

    for i in range(len(dssp)):
        aa_key = aa_key + str(dssp[list(dssp.keys())[i]][1])
        ss_key = ss_key + str(dssp[list(dssp.keys())[i]][2])

    # Code                    Description
    #   H                     Alpha Helix
    #   B                     Beta Bridge
    #   E                     Strand
    #   G                     Helix-3
    #   I                     Helix-5
    #   T                     Turn
    #   S                     Bend
    #  ' '                    Coil (unstructured)
    #SS-Scheme 1: H,G,I->H ; E,B->E ; T,S->C
    #SS-Scheme 2: H,G->H ; E,B->E ; I,T,S->C THIS IS DEFAULT
    #SS-Scheme 3: H,G->H ; E->E ; I,B,T,S->C
    #SS-Scheme 4: H->H ; E,B->E ; G,I,T,S->C
    #SS-Scheme 5: H->H ; E->E ; G,I,B,T,S->C

    ss_key = string.replace(ss_key, '-', 'C')
    #Scheme 1
    #    ss_key = string.replace(ss_key, 'G', 'H')
    #    ss_key = string.replace(ss_key, 'I', 'H')
    #    ss_key = string.replace(ss_key, 'B', 'E')
    #    ss_key = string.replace(ss_key, 'T', 'C')
    #    ss_key = string.replace(ss_key, 'S', 'C')
    #Scheme 2
    ss_key = string.replace(ss_key, 'G', 'H')
    ss_key = string.replace(ss_key, 'B', 'E')
    ss_key = string.replace(ss_key, 'I', 'C')
    ss_key = string.replace(ss_key, 'T', 'C')
    ss_key = string.replace(ss_key, 'S', 'C')
    #Scheme 3
    #    ss_key = string.replace(ss_key, 'G', 'H')
    #    ss_key = string.replace(ss_key, 'B', 'C')
    #    ss_key = string.replace(ss_key, 'I', 'C')
    #    ss_key = string.replace(ss_key, 'T', 'C')
    #    ss_key = string.replace(ss_key, 'S', 'C')
    #Scheme 4
    #    ss_key = string.replace(ss_key, 'B', 'E')
    #    ss_key = string.replace(ss_key, 'G', 'C')
    #    ss_key = string.replace(ss_key, 'I', 'C')
    #    ss_key = string.replace(ss_key, 'T', 'C')
    #ss_key = string.replace(ss_key, 'S', 'C')
    #Scheme 5
    #    ss_key = string.replace(ss_key, 'G', 'C')
    #    ss_key = string.replace(ss_key, 'B', 'C')
    #    ss_key = string.replace(ss_key, 'I', 'C')
    #    ss_key = string.replace(ss_key, 'T', 'C')
    #    ss_key = string.replace(ss_key, 'S', 'C')

    print(aa_key)
    print(ss_key)

else:
    parser.error(
        '\n\n !!! Input file "%s" does not exist !!!\n' %
        args.input_file)