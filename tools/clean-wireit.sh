#
# Copyright (c) Anthaathi Private Limited 2023.
#
# This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
# Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
#
# Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
#

#!/bin/bash

find . -name ".wireit" -type d -prune -exec rm -rf '{}' +
rm -rf modules/lib/anthaathi-components/dist
rm -rf modules/lib/anthaathi-components/types
